const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Controller to get the count of distinct categories
exports.getCategoryCount = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const categoryCount = categories.length;
    res.json({ categoryCount });
  } catch (error) {
    console.error('Error fetching category count:', error);
    res.status(500).json({ message: 'Error fetching category count' });
  }
};

// Controller to get the count of products
exports.getProductCount = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.json({ productCount });
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ message: 'Error fetching product count' });
  }
};

// Controller to get the total sales from the entire collection
exports.getTotalSales = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" }
        }
      }
    ]);

    const totalSales = result.length > 0 ? result[0].totalSales : 0;
    res.json({ totalSales });
  } catch (error) {
    console.error('Error fetching total sales:', error);
    res.status(500).json({ message: 'Error fetching total sales' });
  }
};

// Controller to get the top-selling products based on revenue
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topSellingProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantity' },
          totalRevenue: { $sum: '$total' },
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,
          productId: '$product._id',
          name: '$product.name',
          category: '$product.category',
          totalSold: 1,
          totalRevenue: 1,
        }
      },
      {
        $sort: { totalRevenue: -1 } // Sort by total revenue
      },
      {
        $limit: 5
      }
    ]);

    res.json(topSellingProducts);
  } catch (error) {
    console.error('Error fetching top-selling products:', error);
    res.status(500).json({ message: 'Error fetching top-selling products' });
  }
};

// Controller to get the low stock alert products (only showing Low Stock and Out of Stock)
exports.getLowStockAlert = async (req, res) => {
  try {
    const lowStockProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'sales',
          localField: '_id',
          foreignField: 'productId',
          as: 'sales'
        }
      },
      {
        $addFields: {
          totalSold: { $sum: { $map: { input: '$sales', as: 'sale', in: '$$sale.quantity' } } },
          stockRemaining: { $subtract: ['$stock', { $sum: { $map: { input: '$sales', as: 'sale', in: '$$sale.quantity' } } }] }
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          stockRemaining: 1,
          status: {
            $cond: [
              { $eq: ['$stockRemaining', 0] }, // If stock remaining is 0
              'Out of Stock',
              {
                $cond: [
                  { $lte: ['$stockRemaining', 5] }, // If stock remaining is less than or equal to 5
                  'Low Stock',
                  null
                ]
              }
            ]
          }
        }
      },
      {
        $match: {
          status: { $in: ['Low Stock', 'Out of Stock'] } // Filter for only Low Stock or Out of Stock
        }
      }
    ]);

    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock alert:', error);
    res.status(500).json({ message: 'Error fetching low stock alert' });
  }
};
