const API_URL=import.meta.env.VITE_API_URL;
export async function apiFetch(path:string,token:string|null,init:RequestInit={}){
    const res= await fetch(`${API_URL}${path}`,{
    ...init,
    headers:{
        "Content-Type":"application/json",
        ...(token? {Authorization: `Bearer ${token}`}:{} ),
        ...init.headers,
    },
});

if(!res.ok){
    const body=await res.json().catch(()=>({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
}
if(res.status===204) return null;
return res.json();
}