import { Injectable } from "@angular/core";
import { cu } from "@fullcalendar/core/internal-common";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  LANG: any | undefined;

  constructor(public translate: TranslateService) {
    // Subscribe to language changes
    this.translate.get(["COMMON"]).subscribe((lang: any) => {
      let obj = {
        COMMON: lang.COMMON,
      };

      // Initialize component data based on language
      this.LANG = obj;
    });

    // Handle language changes
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      let obj = {
        COMMON: event.translations.COMMON,
      };

      // Update component data on language change
      this.LANG = obj;
    });
  }

  /**
   * Recursively flattens an object with nested structures into a single-level object with dot notation.
   * @param {Object} obj - The object to be flattened.
   * @param {String} parentKey - The base key from the previous level of recursion.
   * @param {Object} result - The accumulator object where all properties are being collected.
   * @returns {Object} - The flattened object.
   */
  public flattenObject(
    obj: any,
    parentKey: string = "",
    result: any = {}
  ): any {
    // Iterate over each property in the object
    for (let key in obj) {
      // Ensure the key is actually a property of the object, not inherited
      if (obj.hasOwnProperty(key)) {
        // Construct the new key name based on parent keys and the current key
        let propName = parentKey ? parentKey + "." + key : key;

        // If the property is an object, recurse further to flatten it
        if (
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key]) &&
          obj[key] !== null
        ) {
          this.flattenObject(obj[key], propName, result);
        } else if (Array.isArray(obj[key])) {
          // If it's an array, iterate over its elements
          for (let i = 0; i < obj[key].length; i++) {
            // If the element is an object, recurse into it
            if (typeof obj[key][i] === "object") {
              this.flattenObject(obj[key][i], propName + "[" + i + "]", result);
            } else {
              // Otherwise, directly assign the value to the result object
              result[propName + "[" + i + "]"] = obj[key][i];
            }
          }
        } else {
          // If the property is a primitive, directly assign it to the result object
          result[propName] = obj[key];
        }
      }
    }
    return result; // Return the fully flattened object
  }

  public calculateTimeAgo(timestamps: string): string {
    if (timestamps) {
      const now = new Date();
      const diffInMs =
        now.getTime() - new Date(timestamps.replace(" ", "T")).getTime();

      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} ${this.LANG?.COMMON?.LABEL?.SECONDSAGO}`;
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${this.LANG?.COMMON?.LABEL?.MINUTESAGO}`;
      } else if (diffInHours < 24) {
        return `${diffInHours} ${this.LANG?.COMMON?.LABEL?.HOURSAGO}`;
      } else {
        return `${diffInDays} ${this.LANG?.COMMON?.LABEL?.DAYSAGO}`;
      }
    } else {
      return "";
    }
  }

  public shortedName(name: string): string {
    if (!name) return "";

    const bagian: string[] = name.trim().split(/\s+/); // pecah berdasarkan spasi
    if (bagian.length === 1) return bagian[0]; // kalau cuma 1 kata, kembalikan apa adanya

    const namaDepan = bagian[0];
    const singkatan = bagian
      .slice(1)
      .map((n) => n.charAt(0).toUpperCase() + ".")
      .join(" ");

    return `${namaDepan} ${singkatan}`;
  }

  public getInitials(name: string): string {
    if (!name) return "";
    name = name.replace(/<[^>]+>/g, "");
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0]
      ? nameParts[0].charAt(0).toUpperCase()
      : "";
    const lastNameInitial = nameParts[nameParts.length - 1]
      ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      : "";
    return firstNameInitial + lastNameInitial;
  }

  public getAvatarClass(initials: string): string {
    const classes = [
      "bg-primary",
      "bg-secondary",
      "bg-success",
      "bg-danger",
      "bg-warning",
      "bg-info",
      "bg-light",
      "bg-dark",
    ];
    let charCodeSum = 0;
    for (let i = 0; i < initials.length; i++) {
      charCodeSum += initials.charCodeAt(i);
    }
    return classes[charCodeSum % classes.length];
  }

  public truncateText(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  // Utility function to calculate Levenshtein distance
  getLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Compute distance
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b[i - 1] === a[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  isTwoMonthsOrMore(currentDate: any, dateToCompare: any): boolean {
    const date1 = moment(dateToCompare); // Contoh: 11 Maret 2024
    const date2 = moment(currentDate); // Contoh: 2 bulan setelah date1

    // Cek apakah selisihnya lebih dari atau sama dengan 2 bulan
    const isTwoMonthsOrMore = date2.diff(date1, "months") >= 1;

    return isTwoMonthsOrMore;
  }
}
