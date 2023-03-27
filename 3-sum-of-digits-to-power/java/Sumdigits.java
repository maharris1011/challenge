// class Declaration

public class Sumdigits
{
   public static void main(String[] args)
   {
       System.out.println("Narcissistic Number");
       var exponent = 5;
       if (args.length > 0)
       {
           exponent = Integer.parseInt(args[0]);
       }

       DigitFinder df = new DigitFinder(exponent);
       long minNum = df.minNumber();
       System.out.println(minNum + ": " + exponent + ": ");
       df.matchingNumbers(minNum);

   }
}