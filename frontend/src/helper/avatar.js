export const avatarInitials = (toInitials) => {
  const matches = toInitials.match(/\b(\w)/g);
  const returnStr = matches.join('');
  return returnStr.toUpperCase();
}