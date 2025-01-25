import Blog from "../models/blog.js";

const BlogController = {
  getBlogs: async (req, res) => {
    try {
      const { page, limit, tags, isPriority, isLatest, isRandom } = req.query;
      if (!page || !limit) throw new Error("Page or Limit is required!");

      const skipBlogs = (page) * limit; // Corrected pagination calculation
      const ITEM_PER_PAGE = page * limit;

      let queryParams = {
        ...(tags ? { tags: { $in: tags.split(",") } } : {}),
      };

      let sortParams = {
        _id: 1, // Default sorting by ID
        ...(isPriority ? { priority: 1 } : {}),
        ...(isLatest ? { createdAt: -1 } : {}), // Latest blogs in descending order
      };

      // Random sorting uses aggregation; others use the query builder
      let blogs;
      if (isRandom) {
        blogs = await Blog.aggregate([
          { $match: queryParams },
          { $sample: { size: limit } },
        ]);
      } else {
        blogs = await Blog.find(queryParams)
          .sort(sortParams)
          .skip(skipBlogs)
          .limit(parseInt(limit));
      }

      const totalBlogs = await Blog.countDocuments(queryParams);

      res.status(200).json({
        success: true,
        message: blogs,
        totalBlogs,
        hasNextPage: ITEM_PER_PAGE < totalBlogs,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getBlogsPublic: async (req, res) => {
    try {
      const { page, limit, tags } = req.query;
      if (!page || !limit) throw new Error("Page or Limit is required!");

      const skipBlogs = page * limit;
      const ITEM_PER_PAGE = page * limit;

      let queryParams = {
        ...(tags ? { tags: { $in: tags.split(",") } } : {}),
      };

      const blogs = await Blog.find(queryParams)
        .sort({ createdAt: -1 })
        .skip(skipBlogs)
        .limit(limit);

      const totalBlogs = await Blog.countDocuments(queryParams);

      res.status(200).json({
        success: true,
        message: blogs,
        totalBlogs,
        hasNextPage: ITEM_PER_PAGE < totalBlogs,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getBlogById: async (req, res) => {
    try {
      const blog = await Blog.findOne({
        slug: req.params.id,
      });
      let blogs = await Blog.aggregate([
        { $sample: { size: 4 } },
      ]);
      if (!blog) throw new Error("Blog not found");

      return res.status(200).json({ message: blog, blogs });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createBlog: async (req, res) => {
    try {
      const blog = await Blog.create(req.body);
      return res.status(200).json({ message: blog });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedBlog) throw new Error("Blog Not Found");

      return res.status(200).json({ message: updatedBlog });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteBlog: async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) throw new Error("Blog Not Found");

      return res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default BlogController;
