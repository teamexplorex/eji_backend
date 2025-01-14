import Package from "../models/package.js";

const PackageController = {
  getPackages: async (req, res) => {
    try {
      const { page = 1, limit = 10, tags, isFlightIncluded } = req.query;
      if (!page || !limit) throw new Error("Page or Limit is required!");

      const skipPackages = (page) * limit;
      const ITEM_PER_PAGE = page * limit;

      let queryParams = {
        ...(tags ? { tags: { $in: tags.split(",") } } : {}),
        ...(isFlightIncluded !== undefined ? { isFlightIncluded } : {}),
      };

      const packages = await Package.find(queryParams)
        .sort({ createdAt: -1 })
        .skip(skipPackages)
        .limit(parseInt(limit));

      const totalPackages = await Package.countDocuments(queryParams);

      res.status(200).json({
        success: true,
        message: packages,
        totalPackages,
        hasNextPage: ITEM_PER_PAGE < totalPackages,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getPackageById: async (req, res) => {
    try {
      const packageData = await Package.findById({
        slug: req.params.id,
      });
      if (!packageData) throw new Error("Package not found");

      res.status(200).json({ message: packageData });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createPackage: async (req, res) => {
    try {
      const packageData = await Package.create(req.body);
      res.status(201).json({ message: packageData });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updatePackage: async (req, res) => {
    try {
      const updatedPackage = await Package.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedPackage) throw new Error("Package Not Found");

      res.status(200).json({ message: updatedPackage });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deletePackage: async (req, res) => {
    try {
      const packageData = await Package.findByIdAndDelete(req.params.id);
      if (!packageData) throw new Error("Package Not Found");

      res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default PackageController;
