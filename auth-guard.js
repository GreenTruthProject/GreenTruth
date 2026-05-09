(function () {
  const LOGIN_PAGE = "login.html";
  const SUPABASE_URL = "https://pnyjxbrkiifrsrtmnxro.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueWp4YnJraWlmcnNydG1ueHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDgxOTAsImV4cCI6MjA4ODE4NDE5MH0.uCYdN3SaANJZc5XqT1AdcbjlrFHCY7xaS2ff_y4z84c";

  if (window.location.pathname.endsWith(`/${LOGIN_PAGE}`)) return;

  function redirectToLogin() {
    window.location.replace(LOGIN_PAGE);
  }

  function getClient() {
    if (window._supabase) return window._supabase;
    if (window.supabaseClient) return window.supabaseClient;
    if (!window.supabase?.createClient) return null;
    window.supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );
    return window.supabaseClient;
  }

  async function requireSession() {
    const client = getClient();
    if (!client) {
      redirectToLogin();
      return;
    }

    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error || !session?.user) {
      redirectToLogin();
      return;
    }

    client.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession?.user) redirectToLogin();
    });
  }

  requireSession();
})();
