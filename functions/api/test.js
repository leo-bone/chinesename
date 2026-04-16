// Simple test function
export async function onRequest({ request, env }) {
  return new Response(JSON.stringify({
    message: 'Functions is working!',
    path: '/api/generate',
    method: request.method,
    envKeys: Object.keys(env || {})
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
