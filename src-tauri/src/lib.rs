#[tauri::command]
fn get_model_path() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| e.to_string())?;
    let path = current_dir.join("../models/gemma-2-2b-it-Q4_K_M.gguf");
    let absolute_path = std::fs::canonicalize(&path).unwrap_or(path);
    Ok(absolute_path.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_model_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
