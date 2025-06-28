import axios from "axios";

export async function listSubjects(){
    const token = JSON.parse(localStorage.getItem('token'));;

    const response = await axios.get('/api/subject/list',{
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }
    });
    if(!response){
        throw new Error('Cant fetch data');
    }
    return response.data.users;
};


export async function getElective(){
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await axios.get('/api/elective',{
        headers:{
            'Authorization': 'Bearer '+`${token.token}`
        }});
        if(!response){
            throw new Error('Cant fetch elective subjects !!');
        }
        return response.data;
    }
