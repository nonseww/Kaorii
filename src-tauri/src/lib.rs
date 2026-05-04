use tauri::LogicalSize;
use tauri::Manager;

mod config;
mod ai;
mod security;
mod window_extra;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            config::get_config,
            config::update_config,
            window_extra::resize_window, 
            window_extra::copy_selected_text, 
            window_extra::move_app_to_side,
            ai::ask_openrouter,
            security::save_api_key,
            security::delete_api_key
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
                        gtk_window.set_size_request(70, 70);
                    }
                }
                let _ = window.set_focus();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
