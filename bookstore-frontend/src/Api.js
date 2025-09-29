const API_URL = "http://127.0.0.1:8000";


async function request(path,{method="GET",body}={}){

   const headers = {};

   let options = {method,headers};

   if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }


 const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  // DELETE might return empty body
  if (res.status === 204 || res.headers.get("Content-Length") === "0") return null;
  return res.json();

}



  export const api={

        getBooks:()=>request("/books"),
        getBook:(id)=>request(`/books/${id}`),
        createBook:(book)=>request("/books",{method:"POST",body:book}),
        updateBook:(id,book)=>request(`/books/${id}`,{method:"PUT",body:book}),
        deleteBook:(id)=>request(`/books/${id}`,{method:"DELETE"}),

  };





