(function() {
  try {
    const theme = localStorage.getItem('loop-theme');
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.classList.add(theme);
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  } catch (e) {
    // Failsafe
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
