use crate::config::AppConfig;
use crate::security::get_api_key_internal;
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
pub async fn ask_openrouter(
    config: AppConfig,
    messages: Vec<UserMessage>
) -> Result<String, String> {
    let model_name = config.api_model.ok_or("No API model selected")?;
    let api_key = get_api_key_internal().map_err(|e| e.to_string())?;

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
      .model(&model_name)
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
