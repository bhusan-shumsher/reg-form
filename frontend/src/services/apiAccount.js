import axios from "axios";
// FOR PRODUCTION REPLACE ALL URL AS 'http://localhost:300/api/account/student'
export async function searchStudentForAccount({rollNumber, studentName, semester, faculty}){
    const token = JSON.parse(localStorage.getItem('token'));
        const response = await axios.get('http://localhost:300/api/account/students',
        {
            headers:{
                'Authorization': 'Bearer '+`${token.token}`
            },
            params:{
                rollNumber,
                name: studentName,
                faculty,
                semester
                    }
        }
        );
        if(!response){
            throw new Error('cant post data');
        }
        return response.data;
    };
    

export async function markAsPaid({rollNumber, paidStatus}){
    const token = JSON.parse(localStorage.getItem('token'));
        const response = await axios.post('http://localhost:300/api/account/change-due',{rollNumber,status:paidStatus},
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