import axios from "axios";
export async function login({email,password}){
    const response = await axios.post('http://localhost:3000/api/registration/login',{
        email,
        password
    });
    if(!response){
        throw new Error('Cant login!')
    }
    return response.data;
};


export async function logout(){
    localStorage.removeItem('token');
};

export async function saveRegDetails(formData){
    const token = JSON.parse(localStorage.getItem('token'));
    console.log(token);
    console.log(formData);
    const response = await axios.post('http://localhost:300/api/registration/savedata',
    formData,
    {
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }
    }
    );
    if(!response){
        throw new Error('cant post data');
    }
    return response.data;
}

export async function uploadSignature(formData){
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await axios.post('http://localhost:300/api/registration/upload-signature',
    formData,
    {
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }
    }
    );
    if(!response){
        throw new Error('cant post data');
    }
    return response.data;
}

export async function uploadExtra(formData){
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await axios.post('http://localhost:300/api/registration/extra-upload',
    formData,
    {
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }
    }
    );
    if(!response){
        throw new Error('cant post data');
    }
    return response.data;
}

export async function generateForm(){
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await axios.post('http://localhost:3000/api/registration/form',null,
    {
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }
    }
    );
    if(!response){
        throw new Error('cant post data');
    }
    return response.data;
}

export async function getRegForm(){
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await axios.get('http://localhost:3000/api/registration/download',
    {

        headers:{
            'Authorization': 'Bearer '+`${token.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        responseType: 'blob'

    },
    );
    if(!response){
        throw new Error('cant get data');
    }
    const file = new Blob([response.data],{type:'application/pdf'});
    const fileUrl = URL.createObjectURL(file);
    return fileUrl;
    // return response.data;
};


export async function tickDocs(data){
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await axios.post('http://localhost:3000/api/registration/tickdocs',data,
    {
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }
    }
    );
    if(!response){
        throw new Error('cant post data');
    }
    return response.data;
}