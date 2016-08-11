const squel = require('squel');
const mysql = require('mysql');
const uuid = require('uuid');

const connection = require('./connectDB');


connection.query(`create table if not exists assignments (
    id varchar(50),
    name varchar(100),
    points int,
    score int
  )`, err => {
    if(err) {
      console.log('TABLE CREATE ERROR:', err);
    }
  });


exports.getAll = function() {
  return new Promise((resolve, reject) => {
    let sql = squel.select().from('assignments').toString();

    connection.query(sql, (err, assignments) => {
      if(err) {
        reject(err);
      } else {
        addGrades(assignments);
        resolve(assignments);
      }
    });
  });
};



exports.getOne = function(id) {
  return new Promise((resolve, reject) => {
    let sql = squel.select()
                   .from('assignments')
                   .where('id = ?', id)
                   .toString();

    connection.query(sql, (err, assignments) => {
      let assignment = assignments[0];

      if(err) {
        reject(err);
      } else {
        addGrades([assignment]);
        resolve(assignment);
      }
    });
  });
};


exports.create = function(newAssignment) {
  return new Promise((resolve, reject) => {

    let sql = squel.insert()
                   .into('assignments')
                   .setFields(newAssignment)
                   .set('id', uuid())
                   .toString();

    connection.query(sql, err => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.delete = function(id) {
  return new Promise((resolve, reject) => {
    let sql = squel.delete()
                   .from('assignments')
                   .where('id = ?', id)
                   .toString();

    connection.query(sql, err => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


exports.update = function(id, updateObj) {
  return new Promise((resolve, reject) => {

    let sql = squel.update()
                   .table('assignments')
                   .setFields(updateObj)
                   .where('id = ?', id)
                   .toString();

    connection.query(sql, err => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


exports.getTotal = function() {
  return new Promise((resolve, reject) => {

    let sql = squel.select().from('assignments').toString();

    connection.query(sql, (err,assignments) => {
      if(err) {
        reject(err);
      } else {

        resolve(assignments);
      }
    });
  });
};


function addGrades(assignments){
  var graded = assignments.map(assignment=>{
    var p = Math.floor(assignment.score/assignment.points*100),grade;
    // console.log(p);
    if(p<50){
      assignment.grade = 'F';return assignment.grade;
    }else if(p>50 && p<60){
      assignment.grade = 'E';return assignment.grade;
    }else if(p>=60 && p<70){
      assignment.grade = 'D';return assignment.grade;
    }else if(p>=70 && p<80){
      assignment.grade = 'C';return assignment.grade;
    }else if(p>=80 && p<90){
      assignment.grade = 'B';return assignment.grade;
    }else if(p>=90){
      assignment.grade = 'A';return assignment.grade;
    }

  });
  return graded;
}
