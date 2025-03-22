export async function sendData(route, username, password, confirmPassword = null) { 
  try {
    const response = await fetch(`http://localhost:3000/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username, 
        password, 
        confirmPassword
      })
    });
    
    /*if(!response.ok) {
      throw new Error (`HTTP error! status: ${response.status}`);
    }*/
     
    const responseData = await response.json();
    return responseData
     
  } catch(err) {
    console.error("Error:", err)
    throw err;
  }
}