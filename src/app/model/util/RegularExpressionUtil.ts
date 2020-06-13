export class RegularExpressionUtil {
  public static urlReg: string =
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
  public static numberReg: string = "^[0-9]*$";
}
