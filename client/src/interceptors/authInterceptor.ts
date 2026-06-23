
//Similarly this is inspired from https://github.com/mtikcode/Moji_JWT_Auth
let accessToken: string | null = localStorage.getItem("accessToken");
const setAccessToken = (token: string) => {
    accessToken = token;
    localStorage.setItem("accessToken", token);
};


//called after login or refresh page
const refreshAccessToken = async (): Promise<string> => {
    
    const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include" //this sends HTTP-only(we set the the mode in /login route) cookie containing refresh token
    });

    if (!res.ok){
        throw new Error("Session expired");
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
};

const authInterceptor = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {


    //below Wraps fetch()
    //Automatically adds JWT token
    
    //Automatically retries request once
    const makeRequest = (token: string | null) =>
        fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: token ? `Bearer ${token}` : ""
            }
        });
 
    let res = await makeRequest(accessToken);  
    //Automatically refreshes token if expired
    if (res.status === 401) {
        try {
            
            const newToken = await refreshAccessToken();// Try to get a new access token silently
            res = await makeRequest(newToken);// Retry original request with new token
        } catch (err) {
            //if everything fails we can fall back to force logout
            localStorage.removeItem("accessToken");
            accessToken = null;
            window.location.href = "/login";
        }
    }

    return res;
};
export default authInterceptor;