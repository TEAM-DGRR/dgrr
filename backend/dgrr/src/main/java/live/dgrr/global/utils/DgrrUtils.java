package live.dgrr.global.utils;

public class DgrrUtils {

    public static Rank rankCalculator(int rating) {
        if(rating < 1600) {
            return Rank.BRONZE;
        }
        else if(rating < 1800) {
            return Rank.SILVER;
        }
        return Rank.GOLD;
    }
}
