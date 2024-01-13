/**
 * Based on config variable returns boolean if bot should respond to random message in chat.
 */
export const shouldRandomlyRespond = () => {
  const chance = Number(process.env.CHANCE_TO_RANDOMLY_RESPOND);
  return Math.random() < chance;
}

export const shouldRandomlyReact = () => {
  const chance = Number(process.env.CHANCE_TO_RANDOMLY_REACT);
  return Math.random() < chance;
}

export const shouldRandomlySendVoice = () => {
  const chance = Number(process.env.CHANCE_TO_RANDOMLY_SEND_VOICE);
  return Math.random() < chance;
}