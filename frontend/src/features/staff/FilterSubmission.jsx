import { useForm } from "react-hook-form";

import {useState} from 'react'
import { useFilterByRegistration } from "../../hooks/adminHooks/useFilterRegistration";
export default function FilterSubmission(){
    const {register, handleSubmit,formState} = useForm();
    const [enabled, setEnabled] = useState(false);
    const [values,setValues] = useState([]);
    const {data,isLoading,error,isError} = useFilterByRegistration(values,{enabled:false});

    function onSubmit(formdata){
           console.log(formdata);
           setValues(formdata);
           setEnabled(true);
    }
    function onError(){

    }
    // console.log(data);
    if(isLoading){
        return(
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <h4>Data Loading ....</h4>
                    </div>

                </div>
            </div>
        );
    }
    return(
        <div className="main-wrapper">
                    <div className="page-wrapper">
        <div className="content container-fluid">

            <div className="page-header">
            <div className="row align-items-center">
            <div className="col">
            <h3 className="page-title">Registration Form Sumission List</h3>
            <ul className="breadcrumb">
            <li className="breadcrumb-item">Dashboard</li>
            <li className="breadcrumb-item active">Exam Form Submitted</li>
            </ul>
            </div>
            </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit,onError)}>
<div className="student-group-form">
<div className="row">

<div className="col-lg-2 col-md-6">
<div className="form-group">
<select type="text" className="form-control"
    {...register('type')}
>
<option value='SUBMITTED'>Submitted</option>
    <option value="NOT-SUBMITTED">Not Submitted</option>
</select>
</div>

</div>
<div className="col-lg-2 col-md-6">
<div className="form-group">
<select type="text" className="form-control" {...register('faculty')}>
    <option value='BESE'>BESE</option>
    <option value="BEIT">BEIT</option>
    <option value="BECE">BECE</option>
    <option value="BECIVIL">BECIVIL</option>
    <option value="BARCH">BARCH</option>
    <option value="BBA">BBA</option>
    <option value="BCA">BCA</option>
</select></div>
</div>

<div className="col-lg-2">
<div className="search-student-btn">
<button type="btn" className="btn btn-primary">Search</button>
</div>
</div>
{/* /////// */}
</div>
</div>
</form>

            <div className="row">
            <div className="col-sm-12">
            <div className="card card-table">
            <div className="card-body">

                    <div className="table-responsive">
                    <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                    <thead className="student-thread">
                    <tr>
                    <th>Email</th>
                    <th>Faculty</th>
                    <th className="text-end">Status</th>
                    </tr>
                    </thead>
                                    <tbody>
                                    {data?showList(data):null}
                                    </tbody>
                    </table>
                    </div>
            </div>
            </div>
            </div>
            </div>
        </div>

                    </div>
        </div>
    );
}

function showList(students){
    if(students.length < 1){
        return (<h5>No Students</h5>);
    }
    else{
            
            return students.map((st,index)=>{
                return(
                    <tr keys={index}>
                <td>{st.email}</td>
                <td>{st.faculty}</td>
                <td className="text-end">
                {st.formSubmitted ?<span className="badge badge-success">Submitted</span>: 
                    <span className="badge badge-danger">Unsubmitted</span>
                }
                </td>
</tr>
                );
            })
    }
}
