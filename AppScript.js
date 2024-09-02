function convertSpreadsheetToJson() {
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("App Script Test");
var data = sheet.getDataRange().getValues();

var questions = [];
var currentQuestion = null;
var testCaseId = 1;
var defaultCodeId = 0;
var count = 2; // Initialize count outside the loop

for (var i = 1; i < data.length; i++) {
var row = data[i];

// Check for the start of a new question
if (row[0] && row[1] && row[2] && row[0] !== "End Of Question") {
if (currentQuestion) {
questions.push(currentQuestion);
      }
var new_id = Utilities.getUuid();
currentQuestion = {
"input_output": [
          {
"input": []
          }
        ],
"question_text": row[2] || "",
"code_data": "",
"short_text": row[3] || "",
"question_type": "CODING",
"question_key": 0,
"skills": [],
"question_format": "CODING_PRACTICE",
"content_type": "MARKDOWN",
"difficulty": row[1] || "",
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
"solutions": [{
"order": 1,
"title": {
"content": "Code",
"content_type": "TEXT"
          },
"description": {
"content": "",
"content_type": ""
          },
"code_details": [],
"complexity_analysis": {
"content": "",
"content_type": ""
          }
        }],
"hints": [],
"code_metadata": [],
"cpp_python_time_factor": 0,
"question_id": new_id,
"tag_names": [
"POOL_1",
"DIFFICULTY_"+ row[1] || "",
"IN_OFFLINE_EXAM",
"TOPIC_DSA_CODING",
"SOURCE_NI_ASSESMENT",
"SUB_TOPIC_"+ row[4].toUpperCase() || "",
"COMPANY_UNKNOWN",
new_id
        ],
"language_code_repository_details": []
      };
count = 2; // Reset count for the new question
    }

// Add test cases to the current question
if (row[9] && row[10]) {
let newTestCase = {
"input": row[9] || "",
"output": String(row[10] || ""), // Convert output to string explicitly
"score": 1,
"testcase_type": row[11] || "NORMAL_CASE",
"t_id": testCaseId++
      };

if (count >= 1) {
newTestCase["is_hidden"] = false;
count = count - 1;
      } else {
newTestCase["is_hidden"] = true;
      }

currentQuestion.input_output[0].input.push(newTestCase);
    }

if (row[7] && row[8]) {
currentQuestion.code_metadata.push({
"is_editable": true,
"language": row[7] === "PYTHON" ? "PYTHON39" : row[7],
"code_data": row[8] || "",
"default_code": row[7] === "PYTHON"
      });
    }

if (row[6] && row[5]) {
currentQuestion.solutions[0].code_details.push({
"code_content": row[6] || "",
"language": row[5] === "PYTHON" ? "PYTHON39" : row[5],
"default_code": row[5] === "PYTHON"
      });
    }

if (row[12] && row[13]) {
let file_name = "";
let execute_file_path = "";
let submit_file_path = "";

switch(row[12]) {
case "PYTHON":
file_name = "main.py";
execute_file_path = "main.py";
submit_file_path = "solution.py";
break;
case "CPP":
file_name = "main.cpp";
execute_file_path = "main.cpp";
submit_file_path = "Solution.cpp";
break;
case "C":
file_name = "main.c";
execute_file_path = "main.c";
submit_file_path = "Solution.c";
break;
case "JAVASCRIPT":
file_name = "main.js";
execute_file_path = "main.js";
submit_file_path = "Solution.js";
break;
default:
file_name = "Main.java";
execute_file_path = "Main.java";
submit_file_path = "Solution.java";
      }

currentQuestion.language_code_repository_details.push({

"language": row[12] === "PYTHON" ? "PYTHON39" : row[12],
"file_path_to_execute": execute_file_path,
"default_file_path_to_submit_code": submit_file_path,
"code_repository": [
          {
"file_name": file_name,
"file_type": "FILE",
"file_content": Utilities.base64Encode(row[13]) || ""
          }
        ]
      });
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
