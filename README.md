# contact-manager
This simple app uses a file-based storage to manage contacts, Express to handle api calls, and handlebars to render the front-end.

It automatically populates a list of tags to filter contacts by. Typing in the search bar automatically updates the list.

#### TODO:
 - Bug: With an active search query, toggle some tags. This will cause the application to behave as though there is no search query until the search query is modified.
 - Implement useable browser routing -- i.e. putting in /#contacts/new in the browser should take the user to the new contacts form.
