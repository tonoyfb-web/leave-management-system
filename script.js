 async function saveLeaveRequest(data) {
  const response = await fetch('https://your-server.com/api/leaves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
