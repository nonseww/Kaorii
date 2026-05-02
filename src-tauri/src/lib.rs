use std::thread;
use std::time::Duration;

use enigo::Enigo;
use enigo::KeyboardControllable;
use tauri::LogicalSize;
use tauri::Manager;

#[cfg(target_os = "linux")]
#[tauri::command]
fn get_model_path() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| e.to_string())?;
    let path = current_dir.join("../models/gemma-2-2b-it-Q4_K_M.gguf");
    let absolute_path = std::fs::canonicalize(&path).unwrap_or(path);
    Ok(absolute_path.to_string_lossy().to_string())
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
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_model_path, resize_window, copy_selected_text, move_app_to_side])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let size = LogicalSize::new(70.0, 70.0);
                let _ = window.set_size(size);
                let _ = window.set_min_size(Some(size));
                let _ = window.set_max_size(Some(size));
                let _ = window.set_resizable(false);
                let _ = window.set_focus();

                #[cfg(target_os = "linux")]
                {
                    if let Ok(gtk_window) = window.gtk_window() {
                        use gtk::prelude::*;
                        gtk_window.set_size_request(60, 60);
                        //gtk_window.resize(60, 60);
                    }
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
