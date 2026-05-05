use std::fs;
use serde::{Serialize, Deserialize};
use tauri::Manager;

#[derive(Serialize, Deserialize, Default)]
pub struct AppConfig {
    pub model_path: Option<String>,
    pub icon_path: Option<String>,
    pub api_model: Option<String>,
    pub api_key_masked: Option<String>,
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
pub fn update_config(app_handle: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    save_config_to_disk(&app_handle, config)
}

#[tauri::command]
pub fn get_config(app_handle: tauri::AppHandle) -> Result<AppConfig, String> {
    let config_path = get_config_path(&app_handle);
    if config_path.exists() {
        let json = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
        let config: AppConfig = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        return Ok(config)
    }
    Ok(AppConfig::default())
}