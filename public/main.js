const Root = React.createClass({
  render : function(){
    return (
      <div>
      <h1>Assignments</h1>
      <Assignments/>
      </div>
    );
  }

});

const AssignmentForm = React.createClass({
  getInitialState : function(){
    return {
      name : '',
      points : '',
      score : ''
    }
  },
  addAssignment : function(e){
    e.preventDefault();
    let assignObj = {name : this.state.name,points : this.state.points,score : this.state.score };
    this.props.addAssign(assignObj);

  },
  resetForm : function(e){
    e.preventDefault();
    this.setState({name : '',points : '',score : ''});
  },
  render : function(){
     return (
       <form>
         <input type="text" value={this.state.name} onChange={e=> this.setState({name : e.target.value})} placeholder="Assignment"/><br/>
         <input type="number" value={this.state.points} onChange={e=> this.setState({points : e.target.value})} placeholder="Points"/><br/>
         <input type="number" value={this.state.score} onChange={e=> this.setState({score : e.target.value})} placeholder="Score"/><br/>
         <button onClick={this.addAssignment}>Add</button>
         <button onClick={this.resetForm}>Reset</button>
       </form>
     );
  }
});

const Assignments = React.createClass({
  getInitialState : function(){
    $.ajax({
      type: "GET",
      dataType : "json",
      url: "/grades",
    })
    .done(data=>{
      this.setState({data : data});
      // console.log(data);
    })
    .fail(err=>console.log('err',err));
    return {
      data : []
    }
  },
  addAssign : function(newAssignment){
    // console.log("from addAssign");
    $.ajax({
      type : "POST",
      url : "/grades",
      data : newAssignment
    }).done(data=>{
      this.setState({data : data});
    });
  },
  deleteAssign : function(id){
    // console.log("from deleteAssign");
    $.ajax({
      type : "DELETE",
      url : `/grades/${id}`,
    }).done(data=>{
      this.setState({data : data});
    });
  },
  modifyAssign : function(id){
    let i = this.state.data.findIndex(x => x.id ===id);
    let mAssign = this.state.data;
    let name = prompt("Change Assignment",mAssign[i].name);
    let points = prompt("Change State",mAssign[i].points);
    let score = prompt("Change Population",mAssign[i].score);
    let data = {name,points,score};
    $.ajax({
      type : "PUT",
      url : `/grades/${id}`,
      data : data
    }).done(data=>{
      this.setState({data : data});
    });
  },
  render : function(){

    return (
      <div>
      <AssignmentForm addAssign={this.addAssign} />
      <AssignmentsTable data={this.state.data} deleteAssign={this.deleteAssign} modifyAssign={this.modifyAssign}/>
      </div>
    );
  }
});

const AssignmentsTable = React.createClass({
  delete : function(e){
    this.props.deleteAssign(e.target.value);
  },
  modify : function(e){

    this.props.modifyAssign(e.target.value);
  },
  render : function(){
    let assignments = this.props.data.map(assignment=>{
      return (
        <tr key={assignment.id}>
          <td>{assignment.name}</td>
          <td>{assignment.points}</td>
          <td>{assignment.score}</td>
          <td>{assignment.grade}</td>
          <td>
            <button onClick={this.delete} value={assignment.id}>-</button>
            <button onClick={this.modify} value={assignment.id}>?</button>
          </td>
        </tr>
      );
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Assignments</th>
            <th>Points</th>
            <th>Score</th>
            <th>Grade</th>
          </tr>
        </thead>
          <tbody>
            {assignments}
          </tbody>
      </table>

    );
  }
});

ReactDOM.render(
  <Root/>,
  document.getElementById('root')
);
