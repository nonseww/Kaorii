use std::thread;
use std::time::Duration;

use enigo::Enigo;
use enigo::KeyboardControllable;
use tauri::LogicalSize;
use tauri::Manager;
use std::fs;
use serde::{Serialize, Deserialize};
use openrouter_rs::{
    OpenRouterClient,
    api::chat::{ChatCompletionRequest, Message as ORMessage},
    types::Role
};

#[derive(serde::Deserialize)]
pub struct UserMessage {
    pub role: String,
    pub content: String
}

#[tauri::command]
async fn ask_openrouter(
    api_key: String,
    model: String,
    messages: Vec<UserMessage>
) -> Result<String, String> {
    let client = OpenRouterClient::builder()
      .api_key(&api_key)
      .http_referer("https://github.com/nonseww/Kaorii")
      .x_title("Kaorii AI")
      .build()
      .map_err(|e| e.to_string())?;

    let api_messages: Vec<ORMessage> = messages.into_iter().map(|m| {
        let role = match m.role.as_str() {
        "system" => Role::System,
        "assistant" => Role::Assistant,
        _ => Role::User,
        };
        ORMessage::new(role, m.content)
    }).collect();

    let request = ChatCompletionRequest::builder()
      .model(&model)
      .messages(api_messages)
      .temperature(0.5)
      .build()
      .map_err(|e| e.to_string())?;

    let response = client.chat().create(&request).await
      .map_err(|e| e.to_string())?;

    let ai_answer = response.choices[0]
      .content()
      .clone()
      .unwrap_or_else(|| "No response").to_string();
    
    Ok(ai_answer)
}

#[derive(Serialize, Deserialize, Default)]
pub struct AppConfig {
    pub model_path: Option<String>,
    pub icon_path: Option<String>
}

fn get_config_path(app_handle: &tauri::AppHandle) -> std::path::PathBuf {
    app_handle.path().app_config_dir().unwrap().join("config.json")
}

fn save_config_to_disk(app_handle: &tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    let config_path = get_config_path(&app_handle);
    let config_dir = config_path.parent().unwrap();
    fs::create_dir_all(config_dir).map_err(|e| e.to_string())?;
    let json = serde_json::to_string(&config).map_err(|e| e.to_string())?;
    fs::write(config_path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn update_config(app_handle: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    save_config_to_disk(&app_handle, config)
}

#[tauri::command]
fn get_config(app_handle: tauri::AppHandle) -> Result<AppConfig, String> {
    let config_path = get_config_path(&app_handle);
    if config_path.exists() {
        let json = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
        let config: AppConfig = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        return Ok(config)
    }
    Ok(AppConfig::default())
}

#[tauri::command]
fn resize_window(window: tauri::WebviewWindow, expanded: bool) {
    let (w, h) = if expanded {
        (450.0, 600.0)
    } else {
        (60.0, 60.0)
    };
    let _ = window.set_size(tauri::LogicalSize::new(w, h));

    #[cfg(target_os = "linux")]
    {
        if let Ok(gtk_window) = window.gtk_window() {
            use gtk::prelude::*;
            gtk_window.set_size_request(w as i32, h as i32);
        }
    }

    if expanded {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[tauri::command]
fn copy_selected_text() {
    let mut enigo = Enigo::new();
    thread::sleep(Duration::from_millis(300));

    enigo.key_down(enigo::Key::Control);
    enigo.key_click(enigo::Key::Layout('c'));
    enigo.key_up(enigo::Key::Control);
}

#[tauri::command]
fn move_app_to_side(window: tauri::WebviewWindow, side: String) -> Result<(), String> {
    if let Ok(Some(monitor)) = window.current_monitor() {
        let scale_factor = monitor.scale_factor();
         let start_pos = window.outer_position().unwrap_or_default().to_logical::<f64>(scale_factor);

        let work_area = monitor.work_area();
        let window_size = window.outer_size().unwrap_or_default().to_logical::<f64>(scale_factor);

        let work_area_logical_pos = work_area.position.to_logical::<f64>(scale_factor);
        let work_area_logical_size = work_area.size.to_logical::<f64>(scale_factor);

        let y = start_pos.y;
        let x = if side == "left" {
            work_area_logical_pos.x
        } else {
            work_area_logical_pos.x + work_area_logical_size.width - window_size.width
        };

        window.set_position(tauri::LogicalPosition::new(x, y)).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            resize_window, 
            copy_selected_text, 
            move_app_to_side,
            ask_openrouter
        ])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let size = LogicalSize::new(70.0, 70.0);
                let _ = window.set_size(size);
                let _ = window.set_min_size(Some(size));
                let _ = window.set_max_size(Some(size));
                let _ = window.set_resizable(false);

                #[cfg(target_os = "linux")]
                {
                    if let Ok(gtk_window) = window.gtk_window() {
                        use gtk::prelude::*;
                        gtk_window.set_size_request(60, 60);
                    }
                }
                let _ = window.set_focus();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
