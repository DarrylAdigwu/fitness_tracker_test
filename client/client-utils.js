/* Send form data to server */
export async function sendData(route, allData, prevUrl = null) {
  let redirectParam;

  if(prevUrl) {
    const params = new URL(prevUrl.href);
    redirectParam = params.searchParams.get("redirect");
  }
  
  try {
    const response = await fetch(`http://localhost:3000/${route}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      allData,
      redirectParam: prevUrl && redirectParam,
    })
  });
    
  const responseData = await response.json();

  if(responseData && responseData.redirectUrl) {
    return window.location.replace(`${responseData.redirectUrl}`);
  } else {
    return responseData;
  }

  } catch(err) {
  console.error("Error:", err)
  throw err;
  }
}

/* Authenticate user */
export async function requireAuth(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  async function fetchSession() {
     try {
    const response = await fetch(`http://localhost:3000/authenticate`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json();
 
    return data;
    } catch(err) {
      console.error('Error:', err);
    }
  }

  const checkSession = await fetchSession();

  if(checkSession && checkSession.invalid) {
    return window.location.replace(`/login?redirect=/dashboard`)
  } else {
    return checkSession.valid;
  }

}


/* Get Current Dates workouts */
export async function getTodaysWorkout(date = "null") {
  const fetchUrl = date ? 
  `http://localhost:3000/dashboard/:username?date=${date}` : 
  `http://localhost:3000/dashboard/:username`;
  try {
    const response = await fetch(`${fetchUrl}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    
    if(!response.ok) {
      throw new Error(`HTTP ERROR: ${response.status}` )
    }

    const data = await response.json();
    return data;

  } catch(err) {
    console.error("Error:", err)
  }
}
