

export default function RegularSubjectTable({subjects,elective}){
    console.log('electives',elective);
    return (
        <div class="col-lg-10">
<div class="card">
<div class="card-header">
<h5 class="card-title">Regular Subjects</h5>
</div>
<div class="card-body">
<div class="table-responsive">
<table class="table table-hover mb-0">
<thead>
<tr>
<th>Course Code</th>
<th>Course Name</th>
<th>Credit Hour</th>
<th>Remarks</th>
</tr>
</thead>
<tbody>
   { subjects?.map((sub,index)=>{
    return <SubjectRow data={sub}/>
   })}
   { elective?.map((sub,index)=>{
    return <SubjectRow data={sub}/>
   })}
</tbody>
</table>
</div>
</div>
</div>
</div>
    )
};


 function SubjectRow ({data}){
    return (
    <tr>
    <td>{data.courseCode}</td>
    <td>{data.subjectName}</td>
    <td>{data.creditHour}</td>
    <td>{data.hasOwnProperty('remarks') ? data['remarks'] : ''}</td>
    </tr>
    )
};
