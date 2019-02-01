## CI Workflow

### 1. Checking out

..* Check out working copy from mainline

	git pull
	git checkout -b "issue/X"
	
..* Note that new branches should start with "issue/" and the issue number

### 2. Modify and create local build

..* Alter code / add or change automated tests

..* Perform build on local machine

### 3. Committing to the repository

..* Update working copy

	git checkout master
	git pull
	git checkout <branch name>
	git merge master

..* Rebuild on local machine

..* Solve merge conflicts 

..* Rebuild and repeat until working copy is stable

..* Commit changes to mainline
  
All commits should include a link to the related issue

	git commit #X "good message"
	git push origin issue/X


..* Create pull request 
			
..* Solve eventual comments

..* Merge the pull request
