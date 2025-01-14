import * as yup from "yup";

const createBlogDto = yup.object().shape({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  description: yup.string().required("Description is required"),
  content: yup.string().required("Content is required"), // Quill editor HTML
  tags: yup.array().of(yup.string()).optional(), // Array of strings
  bannerImage: yup.string().required("Banner Image is required"),
});

export const validateCreateBlog = async (req, res, next) => {
  try {
    let data = await createBlogDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBlogDto = yup.object().shape({
    title: yup.string().optional(),
    description: yup.string().optional(),
    slug: yup.string().optional(),
    content: yup.string().optional(), // Quill editor HTML
    tags: yup.array().of(yup.string()).optional(), // Array of strings
    bannerImage: yup.string().optional(),
    shortBannerImage: yup.string().optional()
  });
  
  export const validateUpdateBlog = async (req, res, next) => {
    try {
      let data = await updateBlogDto.validate(req.body);
      req.body = data;
      next();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  