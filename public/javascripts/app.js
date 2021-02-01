$(() => {
  class Contact {
    constructor(data) {
      this.id = data.id;
      this.update(data);
    }

    static tagsToArray(tagString) {
      return tagString.split(',')
          .map(tag => tag.trim())
          .map(tag => tag.toLowerCase())
          .filter(tag => tag !== '');
    }

    update(data) {
      if (data.tags) {
        this.tags = Contact.tagsToArray(data.tags);
      } else {
        this.tags = null;
      }

      this.name = data.full_name;
      this.email = data.email;
      this.phone = data.phone_number;
    }

    get handlebars() {
      let stringTags;
      if (this.tags) {
        stringTags = this.tags
          .map(tag => tag[0].toUpperCase() + tag.slice(1).toLowerCase())
          .join(', ');
      } else {
        stringTags = 'None';
      }

      return {
        id: this.id,
        full_name: this.name,
        email: this.email,
        phone_number: this.phone,
        tags: stringTags,
      };
    }

    matchesTags(givenTags) {
      if (!givenTags) { 
        return true;
      } else {
        return givenTags.every(givenTag => this.tags.includes(givenTag));
      }
    }

    nameIncludes(string) {
      string = string.toLowerCase();
      return this.name.toLowerCase().includes(string);
    }
  }

  class ContactManager {
    constructor(contactData) {
      this.contacts = contactData.map(contact => new Contact(contact));
      this.parseAllTags();
    }

    get handlebars() {
      return this.contacts.map(contact => contact.handlebars);
    }

    parseAllTags() {
      this.tags = [];
      this.contacts.forEach(contact => {
        if (contact.tags) {
          contact.tags.forEach(tag => {
            if (!this.tags.includes(tag)) {
              this.tags.push(tag);
            }
          });
        }
      });
    }

    filterByTags(tags) {
      return this.contacts.filter(contact => contact.matchesTags(tags))
                          .map(contact => contact.handlebars);
    }

    filterBySearch(content) {
      return this.contacts.filter(contact => contact.nameIncludes(content))
                          .map(contact => contact.handlebars);
    }

    updateContact(contact) {
      let existingContact = this.contacts.find(({id}) => contact.id === id)
      if (existingContact) {
        let index = this.contacts.indexOf(existingContact);
        this.contacts[index] = new Contact(contact);
      } else {
        this.contacts.push(new Contact(contact));
      }
      this.parseAllTags();
    }

    find(id) {
      return this.contacts.find(contact => contact.id === id).handlebars;
    }

    delete(id) {
      this.contacts = this.contacts.filter(contact => contact.id !== id);
      this.parseAllTags();
    }
  }

  let API = {
    fetchContactData() {
      return fetch('/api/contacts').then(response => response.json());
    },

    formSubmit($form) {
      let data = {};
      $form.find('input').each((_, input) => {
        let $input = $(input);
        data[$input.attr('name')] = $input.val().trim();
      });

      if(data.tags) {
        data.tags = data.tags.split(',').filter(tag => tag.trim() !== '').join(',');
      }

      let init = {
        method:  $form.attr('method'),
        headers: {'Content-Type': 'application/json'},
        body:    JSON.stringify(data),
      };

      return fetch($form.attr('action'), init)
        .then(response => response.json());
    },

    delete(id) {
        let init = {
          method: 'delete',
        };
        return fetch(`/api/contacts/${id}`, init);
    },
    
  };
  let App = {
    toggleTag(tag) {
      if (this.activeTags.includes(tag)) {
      let idx = this.activeTags.indexOf(tag);
      this.activeTags.splice(idx, 1);
      } else {
        this.activeTags.push(tag);
      }
    },
    drawHome() {
      this.activeTags = [];
      this.$main.html(this.handlebars.main({
        contacts: this.contactManager.handlebars, 
        tags: this.contactManager.tags,
        message: this.noContactsMessage,
      }));
      window.location.href = '/#home';
    },
    handleAddClick() {
      this.$main.html(this.handlebars.contactForm());
    },
    handleSubmit(event) {
      event.preventDefault();
      this.api.formSubmit($('form'))
        .then(contact => {
          this.contactManager.updateContact(contact);
          this.drawHome();
        });
      
    },
    handleTagClick(event) {
      let tag = $(event.target).toggleClass('active').text();
      this.toggleTag(tag);
      let displayContacts = this.contactManager.filterByTags(this.activeTags);
      $('.contacts').html(this.handlebars.contacts({contacts: displayContacts}));

    },
    handleEditClick(event) {
      event.preventDefault();
      let id = Number($(event.target).attr('href').match(/\d+$/)[0]);
      let contactToEdit = this.contactManager.find(id);
      this.$main.html(this.handlebars.contactEdit(contactToEdit));
      window.location.href = `/#contacts/edit/${id}`;
    },
    handleDeleteClick(event) {
      event.preventDefault();
      let id = Number($(event.target).attr('href').match(/\d+$/)[0]);
      if (confirm("Are you sure you want to delete this contact?")) {
        this.api.delete(id)
          .then(response => {
            if (response.status === 204) {
              this.contactManager.delete(id);
            }
            this.drawHome();
          });
      }
    },
    handleSearch(event) {
      let searchContent = $(event.target).val().trim();
      $('.contacts').html(this.handlebars.contacts({
        contacts: this.contactManager.filterBySearch(searchContent),
         message: searchContent.length > 0 ? 
                  this.noneMatchingQuery : 
                  this.noContactsMessage, 
      }));
    },
    handleClick(event) {
      let $elem = $(event.target);
      if ($elem.is('.add')) {
        this.handleAddClick(event);
      } else if ($elem.is('.cancel')) {
        this.drawHome();
      } else if ($elem.is('.tag')) {
        this.handleTagClick(event);
      } else if ($elem.is('.edit')) {
        this.handleEditClick(event);
      } else if ($elem.is('.delete')) {
        this.handleDeleteClick(event);
      }
    },
    bindEvents() {
      this.$main.on('click', this.handleClick.bind(this));
      this.$main.on('submit', 'form', this.handleSubmit.bind(this));
      this.$main.on('keyup', 'input[name=search]', this.handleSearch.bind(this));
    },
    registerHandlebars() {
      Handlebars.registerPartial('contact', $('#contact').html());
      Handlebars.registerPartial('contacts', $('#contacts').html());
      Handlebars.registerPartial('head', $('#head').html());
      Handlebars.registerPartial('tags', $('#tags').html());
      this.handlebars = {
        main:        Handlebars.compile($('#main').html()),
        head:        Handlebars.compile($('#head').html()),
        tags:        Handlebars.compile($('#tags').html()),
        contacts:    Handlebars.compile($('#contacts').html()),
        contactForm: Handlebars.compile($("#contact_form").html()),
        contactEdit: Handlebars.compile($("#contact_edit").html()),
      };
    },
    init() {
      this.noContactsMessage = "There are no contacts."
      this.noneMatchingQuery = "No contacts matched your query."
      this.$main = $('main');
      this.api = API;
      this.activeTags = [];
      this.registerHandlebars();
      this.api.fetchContactData()
        .then(contacts => {
          this.contactManager = new ContactManager(contacts);
          this.drawHome();
          this.bindEvents();
        });
    },
  };

  App.init();
});