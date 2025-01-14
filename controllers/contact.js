import Contact from "../models/contact.js";

const ContactController = {
  getContacts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const skipContacts = (page) * limit;
      const ITEM_PER_PAGE = page * limit;

      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skipContacts)
        .limit(limit);

      const totalContacts = await Contact.countDocuments();

      res.status(200).json({
        success: true,
        data: contacts,
        totalContacts,
        hasNextPage: ITEM_PER_PAGE < totalContacts,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  
  createContact: async (req, res) => {
    try {
      const contact = await Contact.create(req.body);
      res.status(201).json({ success: true, data: contact });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateContact: async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!contact) throw new Error("Contact not found");

      res.status(200).json({ success: true, data: contact });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) throw new Error("Contact not found");

      res.status(200).json({ success: true, message: "Contact deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default ContactController;
