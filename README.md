# contact-manager
This simple app uses a file-based storage to manage contacts, Express to handle api calls, and handlebars to render the front-end.

It automatically populates a list of tags to filter contacts by.

### Potential improvements
 - Refactor to use a `json` database locally, or perhaps a mongoDB provider
 - Implement browsing history functionality -- currently, the path in the browser is not useful for the user. I could accomplish this by refactoring into React.
