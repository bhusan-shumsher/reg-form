

export default function ListSubject(){
    return(
        <>

<div class="page-wrapper">
<div class="content container-fluid">

<div class="page-header">
<div class="row align-items-center">
<div class="col">
<h3 class="page-title">Subjects</h3>
<ul class="breadcrumb">
<li class="breadcrumb-item"><a href="index.html">Dashboard</a></li>
<li class="breadcrumb-item active">Subjects</li>
</ul>
</div>
</div>
</div>

<div class="student-group-form">
<div class="row">
<div class="col-lg-3 col-md-6">
<div class="form-group">
<input type="text" class="form-control" placeholder="Search by ID ..."/>
</div>
</div>
<div class="col-lg-3 col-md-6">
<div class="form-group">
<input type="text" class="form-control" placeholder="Search by Name ..."/>
</div>
</div>
<div class="col-lg-4 col-md-6">
<div class="form-group">
<input type="text" class="form-control" placeholder="Search by Class ..."/>
</div>
</div>
<div class="col-lg-2">
<div class="search-student-btn">
<button type="btn" class="btn btn-primary">Search</button>
</div>
</div>
</div>
</div>
        <div class="table-responsive">
        <table class="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
        <thead class="student-thread">
        <tr>
        <th>Short Name</th>
        <th>Name</th>
        <th>Faculty</th>
        <th>Semester</th>
        <th>Shift</th>
        <th>Teacher</th>
        <th>Lesson Plan</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>Java</td>
        <td>
        <h2>
        <a>Advanced Programming with Java</a>
        </h2>
        </td>
        <td>BESE</td>
        <td>3</td>
        <td>Morning</td>
        <td>BST</td>
        <td>True</td>
        </tr>
        </tbody>
        </table>
        </div>
    </div>
    </div>
        </>
    );
}


function ShowSubject(subjects){
    return(
        <tbody>
        <tr>
        <td>Java</td>
        <td>
        <h2>
        <a>Advanced Programming with Java</a>
        </h2>
        </td>
        <td>BESE</td>
        <td>3</td>
        <td>Morning</td>
        <td>BST</td>
        <td>True</td>
        </tr>
        </tbody>
    );
}