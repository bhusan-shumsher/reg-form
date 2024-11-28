import {useState} from 'react';
import { useGenerateForm } from "../../hooks/registrationHooks/useGenerateForm";
import Spinner from '../../ui/Spinner';
export default function GenerateForm(){
    const [clicked,setClicked] = useState(false);
    const {generate,isLoading} = useGenerateForm();
    const onSubmit = () => {
      setClicked(true);
        generate();
      }
      if(clicked){
        rerturn(<div className="content container-fluid">
          <div className="page-header">
          <div className="row align-items-center">
          <div className="col-sm-12">
          
          </div>
          </div>
          </div>

          <div className="row">
          <div className="col-sm-12">
          <div className="card comman-shadow">
          <div className="card-body">
          <div className="row">
          <div className="col-12">
          </div>
          <Spinner/>
      </div>
      </div>
      </div>
      </div>
          </div>
   </div>
   );
      }
      if(!isLoading){
        return(<div className="content container-fluid">
        <div className="page-header">
        <div className="row align-items-center">
        <div className="col-sm-12">
        
        </div>
        </div>
        </div>

        <div className="row">
        <div className="col-sm-12">
        <div className="card comman-shadow">
        <div className="card-body">
        <div className="row">
        <div className="col-12">
        <h5 className="form-title student-info">Generate Form<span></span></h5>
        <h6>Please click Generate form</h6>
        </div>
        <form>
      <button 
        type="button" 
        class="btn btn-primary"
        onClick={onSubmit}> Generate</button>
     </form>
    </div>
    </div>
    </div>
    </div>
        </div>
 </div>
 );
}else{
          rerturn(<div className="content container-fluid">
          <div className="page-header">
          <div className="row align-items-center">
          <div className="col-sm-12">
          
          </div>
          </div>
          </div>

          <div className="row">
          <div className="col-sm-12">
          <div className="card comman-shadow">
          <div className="card-body">
          <div className="row">
          <div className="col-12">
          </div>
          <Spinner/>
      </div>
      </div>
      </div>
      </div>
          </div>
   </div>
   );
        
      }
    
}