define({ "api": [
  {
    "type": "get",
    "url": "/build/:commitId",
    "title": "Display specific build log",
    "name": "getBuild",
    "group": "Build",
    "description": "<p>Create a HTML representation of a specific build's log and send it to browser for display</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "commitId",
            "description": "<p>Unique commit ID for a build</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The response message for a build</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>The success response or a build</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The build type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>The timestamp of a build</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "successResponse",
            "description": "<p>Sends specific log information to display in browser</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "buildError",
            "description": "<p>Returns an error response if it is unable to fetch builds from the database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "Error fetching builds from database",
          "type": "String"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Build"
  },
  {
    "type": "get",
    "url": "/builds",
    "title": "Display log for all builds",
    "name": "getBuilds",
    "group": "Build",
    "description": "<p>Create a HTML representation of all the build's logs and send it to browser for display</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>The build's success response</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "commitId",
            "description": "<p>The build's unique commit ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "successResponse",
            "description": "<p>Sends all log information of the builds to display in browser</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorResponse",
            "description": "<p>Returns an error response if it is unable to fetch a build from the database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "Error fetching builds from database",
          "type": "String"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Build"
  },
  {
    "type": "post",
    "url": "/ci",
    "title": "Compile and execute test for repository",
    "name": "postCI",
    "group": "Server",
    "description": "<p>Request compilation and test execution from CI-server for a specific repository.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "commitId",
            "description": "<p>A unique commit ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>The URL to clone repository</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the repository</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fullRepoName",
            "description": "<p>Full name of the repository</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "branchName",
            "description": "<p>Name of the repository's branch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "GITHUB_TOKEN",
            "description": "<p>The token for a github repository</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "buildSuccess",
            "description": "<p>Build was created succesfully</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "{ state: 'success' }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "missingCIFile",
            "description": "<p>The <code>ci-config.json</code> file was not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "missingGithubToken",
            "description": "<p>GitHub token missing</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "saveError",
            "description": "<p>Error when saving to database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    state: 'failure',\n    description: 'Cannot find ci-config.json file',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{ state: 'failure' }",
          "type": "json"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Server"
  }
] });
