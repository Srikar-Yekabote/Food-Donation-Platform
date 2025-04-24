const Food = require('../models/food');

const getDonorAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const allDonations = await Food.find({ user: userId  });


        const totalDonations = allDonations.length;
        const pickedUp = allDonations.filter(item => item.status === 'picked').length;
        const delivered = allDonations.filter(item => item.status === 'delivered').length;
        const collected = allDonations.filter(item => item.isCollected).length;
        const pending = allDonations.filter(item => ['available', 'reserved'].includes(item.status)).length;

        const foodCountMap = {};
        allDonations.forEach(item => {
            const name = item.name.toLowerCase();
            foodCountMap[name] = (foodCountMap[name] || 0) + 1;
        }); 
        
        res.render('donorAnalytics', {
            totalDonations,
            pickedUp,
            delivered,
            collected,
            pending,
            foodCountMap
        });

    } catch (error) {
        console.error('Error in donor analytics:', error);
        res.status(500).send('Something went wrong');
    }
};

module.exports = { getDonorAnalytics };
