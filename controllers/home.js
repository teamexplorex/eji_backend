import blog from "../models/blog.js";
import Package from "../models/package.js";

const HomeController = {
  getHomeData: async (req, res) => {
    try {
      const [
        blogs,
        exploreTheWorldPackages,
        onceInAYearEventPackages,
        dreamVacationPackages,
        beautyOfIndiaPackages,
      ] = await Promise.all([
        blog.find({}).sort({ _id: 1, priority: 1 }),
        Package.find({ tags: { $in: ["EXPLORE_THE_WORLD"] } }).sort({
          _id: 1,
          priority: 1,
        }),
        Package.find({ tags: { $in: ["BEAUTY_OF_INDIA"] } }).sort({
          _id: 1,
          priority: 1,
        }),
        Package.find({ tags: { $in: ["ONCE_IN_A_YEAR_EVENT"] } }).sort({
          _id: 1,
          priority: 1,
        }),
        Package.find({ tags: { $in: ["DREAM_VACATION"] } }).sort({
          _id: 1,
          priority: 1,
        }),
      ]);

      return res.status(200).json({
        blogs,
        exploreTheWorldPackages,
        onceInAYearEventPackages,
        dreamVacationPackages,
        beautyOfIndiaPackages,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default HomeController;
