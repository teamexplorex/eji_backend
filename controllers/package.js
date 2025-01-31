import Package from "../models/package.js";

const PackageController = {
  getPackages: async (req, res) => {
    try {
      const { page = 1, limit = 10, tags, isFlightIncluded, destination, experience, search } = req.query;
      if (!page || !limit) throw new Error("Page or Limit is required!");
      const skipPackages = (page) * limit; // Correct calculation for pagination
      const ITEM_PER_PAGE = limit;
  
      // Base filters
      let queryParams = {
        ...(tags ? { tags: { $in: tags.split(",") } } : {}),
        ...(experience !== undefined && experience !== "undefined" ? { experience } : {}),
        ...(destination !== undefined && destination !== "undefined" ? { destination } : {}),
        ...(isFlightIncluded !== undefined && isFlightIncluded !== "undefined" ? { isFlightIncluded } : {}),
      };
  
      // Add search logic
      if (search && search !== 'null' && search !== 'undefined' && search !== undefined) {
        const searchFields = [
          "name",
          "shortDescription",
          "destination",
          "experience",
          "longDescription",
          "slug",
          "type",
          "packageItinerary.description", // Include itinerary descriptions in the search
          "stays.cityName", // Include stays city name in the search
        ];
  
        queryParams.$or = searchFields.map(field => {
          if (field.includes(".")) {
            // For nested fields
            return { [field]: { $regex: search, $options: "i" } };
          } else {
            // For top-level fields
            return { [field]: { $regex: search, $options: "i" } };
          }
        });
      }
  
      const packages = await Package.find(queryParams)
        .sort({ createdAt: -1 })
        .skip(skipPackages)
        .limit(parseInt(limit));
  
      const totalPackages = await Package.countDocuments(queryParams);
  
      res.status(200).json({
        success: true,
        message: packages,
        totalPackages,
        hasNextPage: skipPackages + ITEM_PER_PAGE < totalPackages,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },  

  getPackageById: async (req, res) => {
    try {
      const packageData = await Package.findOne({
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
