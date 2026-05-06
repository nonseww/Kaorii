use keyring::Entry;

const SERVICE_NAME: &str = "kaorii-ai";
const KEY_NAME: &str = "openrouter_api_key";

#[tauri::command]
pub fn save_api_key(key: String) -> Result<(), String> {
    println!(">>> RUST: Received request to save key: {}...", &key[..4]);
    let entry = Entry::new(SERVICE_NAME, KEY_NAME).map_err(|e| e.to_string())?;
    entry.set_password(&key).map_err(|e| e.to_string())?;
    println!(">>> RUST: Key saved successfully to OS keyring");
    Ok(())
}

#[tauri::command]
pub fn delete_api_key() -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, KEY_NAME).map_err(|e| e.to_string())?;
    entry.delete_credential().map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_api_key_internal() -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, KEY_NAME).map_err(|e| e.to_string())?;
    entry.get_password().map_err(|e| e.to_string())
}
