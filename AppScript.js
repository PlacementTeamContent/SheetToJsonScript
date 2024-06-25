function convertSpreadsheetToJson() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet_1");
  var data = sheet.getDataRange().getValues();
  
  var questions = [];
  var currentQuestion = null;
  var testCaseId = 1;
  var defaultCodeId = 0;
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    
    // Check for the start of a new question
    if (row[0] && row[1] && row[2] && row[0] !== "End Of Question") {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      currentQuestion = {
        "input_output": [
          {
            "input": []
          }
        ],
        "question_text": row[2] || "",
        "short_text": row[3] || "",
        "question_type": "CODING",
        "question_key": 0,
        "skills":[],
        "question_format": "CODING_PRACTICE",
        "content_type": "MARKDOWN",
        "difficulty":row[1] || "",
        "remarks": "",
        "scores_updated": true,
        "scores_computed": 10,
        "questions_asked_by_companies_info": [],
        "test_case_evaluation_metrics": [
          {
            "language": "C",
            "time_limit_to_execute_in_seconds": 2.01
          },
          {
            "language": "CPP",
            "time_limit_to_execute_in_seconds": 2.01
          },
          {
            "language": "PYTHON39",
            "time_limit_to_execute_in_seconds": 10.01
          }
        ],
        "code_repository_details": null,
        "solutions": [],
        "hints":[],
        "code_metadata": [],
        "cpp_python_time_factor": 0,
        "question_id": Utilities.getUuid(),
        "tag_names": [],
        "language_code_repository_details": []
      };
    }
    
    // Add test cases to the current question
    if (row[9] && row[10]) {
      currentQuestion.input_output[0].input.push({
        "input": row[9] || "",
        "output": row[10] || "",
        "is_hidden": false,
        "score": 1,
        "testcase_type": row[11] || "NORMAL_CASE",
        "t_id": testCaseId++
      });
    }
    

     if (row[7] && row[8]) {
      currentQuestion.code_metadata.push({
          "is_editable": true,
          "language": row[7] || "",
          "code_data": row[8] || "",
          "default_code": row[7] === "PYTHON"
      });
    }

    if(row[6] && row[5]){
      if(row[5]==="PYTHON"){
        currentQuestion.solutions.push({
          "order": 1,
          "title": {
            "content": "Code",
            "content_type": "TEXT"
          },
          "description": {
            "content": "",
            "content_type": ""
          },
          "code_details": [
          {
            "code_content": row[6] || "",
            "language": "PYTHON",
            "default_code": true
          }
      
        ],
        "complexity_analysis": {
          "content": "",
          "content_type": ""
        }
      })
    }
    else if(row[5]==="CPP"){
        currentQuestion.solutions.push({
          "order": 1,
          "title": {
            "content": "",
            "content_type": "CPP"
          },
          "description": {
            "content": "",
            "content_type": ""
          },
          "code_details": [
          {
            "code_content": row[6] || "",
            "language": "CPP",
            "default_code": true
          }
      
        ],
        "complexity_analysis": {
          "content": "",
          "content_type": ""
        }
    })
    }
    else{
      currentQuestion.solutions.push({
          "order": 1,
          "title": {
            "content": "",
            "content_type": "JAVA"
          },
          "description": {
            "content": "",
            "content_type": ""
          },
          "code_details": [
          {
            "code_content": row[6] || "",
            "language": "JAVA",
            "default_code": true
          }
      
        ],
        "complexity_analysis": {
          "content": "",
          "content_type": ""
        }
    })
    }
    }
    if (row[12] && row[13]) {
        if(row[12]==="PYTHON"){
          currentQuestion.language_code_repository_details.push({
            "language": "PYTHON",
              "file_path_to_execute": "main.py",
              "default_file_path_to_submit_code": "solution.py",
              "code_repository": [
                {
                  "file_name": "main.py",
                  "file_type": "FILE",
                  "file_content": row[13] || ""
                }
              ]
          });
        }else if(row[12]==="CPP"){
            currentQuestion.language_code_repository_details.push({
              "language": "CPP",
              "file_path_to_execute": "main.cpp",
              "default_file_path_to_submit_code": "Solution.cpp",
              "code_repository": [
                {
                  "file_name": "main.cpp",
                  "file_type": "FILE",
                  "file_content": row[13] || ""
                }
              ]
          });
       }else{
          currentQuestion.language_code_repository_details.push({
             "language": "JAVA",
            "file_path_to_execute": "Main.java",
            "default_file_path_to_submit_code": "Solution.java",
            "code_repository": [
              {
                "file_name": "Main.java",
                "file_type": "FILE",
                "file_content": row[13] || ""
              }
            ]
        });
      }
    }

    
    // Check for the end of the current question
    if (row[0] === "End Of Question") {
      defaultCodeId = i;
      if (currentQuestion) {
        questions.push(currentQuestion);
        currentQuestion = null;
        testCaseId = 1;  // Reset test case ID for the next question
      }
    }
  }
  
  // Add the last question if any
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  const jsonString = JSON.stringify(questions, null, 2);
  Logger.log(jsonString);
var file = DriveApp.createFile('data.json', jsonString);
  Logger.log('JSON file created: ' + file.getUrl());

}
