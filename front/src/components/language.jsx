const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en-US">English</option>
      <option value="hi-IN">Hindi</option>
      <option value="ta-IN">Tamil</option>
      <option value="te-IN">Telugu</option>
      <option value="ml-IN">Malayalam</option>
      <option value="fr-FR">French</option>
      <option value="es-ES">Spanish</option>
    </select>
  );
};

export default LanguageSelector;