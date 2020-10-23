You want to help? You rock! Now, take a moment to be sure your contributions make sense to everyone else.

## Reporting Issues

Found a problem? Want a new feature?

- See if your issue or idea has [already been reported].
- Provide a [reduced test case] or a [live example].

Remember, a bug is a _demonstrable problem_ caused by _our_ code.

## Submitting Pull Requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

1. To begin, [fork this project], clone your fork, and add our upstream.
	```bash
	# Clone your fork of the repo into the current directory
	git clone https://gitlab.com/<your-username>/posthtml-sri
	# Navigate to the newly cloned directory
	cd posthtml-sri
	# Assign the original repo to a remote called "upstream"
	git remote add upstream https://gitlab.com/abogical/posthtml-sri
	# Install the tools necessary for development
	npm install
	```

2. Create a branch for your feature or fix:
	```bash
	# Move into a new branch for a feature
	git checkout -b feature/thing
	```
	```bash
	# Move into a new branch for a fix
	git checkout -b fix/something
	```

3. Be sure your code follows our practices.
	```bash
	# Test current code
	npm run test
	```

4. Push your branch up to your fork:
	```bash
	# Push a feature branch
	git push origin feature/thing
	```
	```bash
	# Push a fix branch
	git push origin fix/something
	```

5. Now [open a merge request] with a clear title and description.

[already been reported]: -/issues
[fork this project]:     -/forks/new
[live example]:          http://codepen.io/pen
[open a merge request]:   https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html	
[reduced test case]:     https://css-tricks.com/reduced-test-cases/
