import { Injectable } from '@angular/core';

/**
 * Service xử lý các template dạng string với placeholders
 */
@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor() {}
  /**
   * Thay thế các placeholder trong template với dữ liệu tương ứng
   * @param template Chuỗi chứa placeholder dạng {{key}}
   * @param data Object chứa dữ liệu để thay thế vào các placeholder
   * @param options Các tùy chọn bổ sung cho việc xử lý template
   * @returns Chuỗi đã được thay thế các placeholder bằng dữ liệu tương ứng
   *
   * Ví dụ:
   * template: "Chào mừng {{first_name}} {{last_name}} đến với công ty {{company}}"
   * data: { first_name: "Văn", last_name: "Cường", company: "SmartHR" }
   * Kết quả: "Chào mừng Văn Cường đến với công ty SmartHR"
   */
  processTemplate(
    template: string,
    data: Record<string, any>,
    options: {
      keepPlaceholder?: boolean; // Giữ lại placeholder nếu không tìm thấy giá trị
      defaultValue?: string; // Giá trị mặc định khi không tìm thấy
      placeholderPattern?: RegExp; // Pattern tùy chỉnh cho placeholder
    } = {},
  ): string {
    if (!template) {
      return '';
    }

    if (!data) {
      return options.keepPlaceholder
        ? template
        : template.replace(/\{\{[^}]+\}\}/g, options.defaultValue || '');
    }

    // Sử dụng pattern mặc định hoặc pattern tùy chỉnh
    const placeholderRegex = options.placeholderPattern || /\{\{([^}]+)\}\}/g;

    // Thay thế mỗi placeholder bằng giá trị tương ứng từ data object
    return template.replace(placeholderRegex, (match, key) => {
      // Xử lý các key với định dạng đặc biệt, ví dụ: key|uppercase
      const [actualKey, ...formatters] = key.split('|');

      // Lấy giá trị từ data sử dụng dot notation (hỗ trợ nested properties)
      let value = this.getNestedValue(data, actualKey);

      // Nếu không tìm thấy giá trị
      if (value === null || value === undefined) {
        return options.keepPlaceholder ? match : options.defaultValue || '';
      }

      // Áp dụng các hàm định dạng nếu có
      if (formatters.length > 0) {
        value = this.applyFormatters(value, formatters);
      }

      return String(value);
    });
  }

  /**
   * Lấy giá trị từ một object sử dụng dot notation
   * @param obj Object chứa dữ liệu
   * @param path Đường dẫn đến giá trị (vd: "user.profile.name")
   * @returns Giá trị tìm được hoặc null nếu không tìm thấy
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc: Record<string, any> | null, part: string) => {
      // Xử lý trường hợp mảng với định dạng person.addresses[0].city
      const arrayMatch = part.match(/(\w+)\[(\d+)\]/);

      if (arrayMatch) {
        const [_, property, index] = arrayMatch;
        return acc && acc[property] && acc[property][Number(index)] !== undefined
          ? acc[property][Number(index)]
          : null;
      }

      return acc && typeof acc === 'object' && part in acc ? acc[part] : null;
    }, obj);
  }

  /**
   * Áp dụng các hàm định dạng cho giá trị
   * @param value Giá trị cần định dạng
   * @param formatters Mảng các tên định dạng cần áp dụng
   * @returns Giá trị sau khi đã định dạng
   */
  private applyFormatters(value: any, formatters: string[]): string {
    let result = String(value);

    formatters.forEach((formatter) => {
      switch (formatter.trim().toLowerCase()) {
        case 'uppercase':
          result = result.toUpperCase();
          break;
        case 'lowercase':
          result = result.toLowerCase();
          break;
        case 'capitalize':
          result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
          break;
        case 'trim':
          result = result.trim();
          break;
        // Có thể thêm các định dạng khác tại đây
      }
    });

    return result;
  }

  /**
   * Dải phẳng hoàn toàn một đối tượng phức tạp, chỉ giữ lại tên key cuối cùng,
   * đưa tất cả các key lên cấp cao nhất mà không còn đường dẫn phân cấp
   *
   * Ví dụ:
   * Input: {
   *   person: {
   *     name: "John",
   *     address: {
   *       city: "NY",
   *       zip: 10001
   *     }
   *   },
   *   company: {
   *     name: "ABC",
   *     address: {
   *       city: "LA"
   *     }
   *   }
   * }
   *
   * Output: {
   *   name: "ABC", // Lấy giá trị cuối cùng khi có trùng key
   *   city: "LA",  // Lấy giá trị cuối cùng khi có trùng key
   *   zip: 10001,
   * }
   *
   * @param obj Đối tượng cần dải phẳng
   * @returns Đối tượng đã được dải phẳng hoàn toàn
   */
  completelyFlattenObject(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    // Lưu lại cả key gốc nếu nó là một giá trị đơn giản
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== null && value !== undefined && typeof value !== 'object') {
          result[key] = value;
        }
      }
    }

    /**
     * Hàm đệ quy để duyệt qua tất cả các thuộc tính của đối tượng
     */
    function traverse(current: any, parentPath: string = '') {
      if (current === null || current === undefined) {
        return;
      }

      // Nếu là đối tượng (không phải mảng)
      if (typeof current === 'object') {
        // Xử lý trường hợp mảng
        if (Array.isArray(current)) {
          // Lưu mảng vào kết quả với key là đường dẫn
          if (parentPath) {
            result[parentPath] = current;
          }

          // Duyệt qua từng phần tử của mảng
          current.forEach((item, index) => {
            if (item !== null && typeof item === 'object') {
              // Với mỗi phần tử là object, duyệt các thuộc tính của nó
              traverse(item, parentPath ? `${parentPath}_${index}` : `item_${index}`);
            }
          });
        } else {
          // Duyệt qua tất cả các thuộc tính của object
          for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
              const value = current[key];
              const newPath = parentPath ? `${parentPath}_${key}` : key;

              // Nếu là giá trị đơn giản (không phải đối tượng), thêm trực tiếp vào kết quả
              if (value === null || value === undefined || typeof value !== 'object') {
                // Lưu cả key đơn và key đầy đủ
                result[key] = value;
                if (parentPath) {
                  result[newPath] = value;
                }
              }
              // Nếu là object hoặc mảng, tiếp tục duyệt đệ quy
              else {
                traverse(value, newPath);
              }
            }
          }
        }
      }
    }

    // Bắt đầu duyệt từ đối tượng gốc
    traverse(obj);

    return result;
  }
  /**
   * Xử lý template với dữ liệu đã được dải phẳng hoàn toàn
   * Tất cả các placeholder sẽ trực tiếp tham chiếu đến key ở cấp cao nhất
   *
   * @param template Chuỗi chứa placeholder
   * @param data Dữ liệu cần xử lý
   * @param options Tùy chọn xử lý
   * @returns Chuỗi đã thay thế placeholder
   */
  processCompletelyFlattenedTemplate(
    template: string,
    data: Record<string, any>,
    options: {
      keepPlaceholder?: boolean;
      defaultValue?: string;
      placeholderPattern?: RegExp;
    } = {},
  ): string {
    if (!template) {
      return '';
    }

    if (!data) {
      return options.keepPlaceholder
        ? template
        : template.replace(/\{\{[^}]+\}\}/g, options.defaultValue || '');
    }

    // Dải phẳng hoàn toàn dữ liệu đầu vào
    const flattenedData = this.completelyFlattenObject(data);

    // Sử dụng pattern mặc định hoặc pattern tùy chỉnh
    const placeholderRegex = options.placeholderPattern || /\{\{([^}]+)\}\}/g;

    // Thay thế mỗi placeholder bằng giá trị từ flattenedData
    const processed = template.replace(placeholderRegex, (match, key) => {
      // Xử lý các key với định dạng đặc biệt, ví dụ: key|uppercase
      const [actualKey, ...formatters] = key.split('|');

      // Tìm kiếm key trong dữ liệu dải phẳng
      let value = flattenedData[actualKey];

      // Nếu không tìm thấy và actualKey có dấu chấm, thử lấy phần cuối cùng của key
      if ((value === null || value === undefined) && actualKey.includes('.')) {
        const simpleKey = actualKey.split('.').pop() || '';
        value = flattenedData[simpleKey];
      }

      // Nếu không tìm thấy giá trị
      if (value === null || value === undefined) {
        return options.keepPlaceholder ? match : options.defaultValue || '';
      }

      // Áp dụng các hàm định dạng nếu có
      if (formatters.length > 0) {
        value = this.applyFormatters(value, formatters);
      }

      return String(value);
    });

    return processed;
  }

  /**
   * Xử lý template dữ liệu ứng viên với phương pháp dải phẳng hoàn toàn
   * Sử dụng phương thức này khi muốn tất cả các placeholder chỉ cần tham chiếu đến tên thuộc tính
   * mà không cần biết cấu trúc phân cấp
   *
   * Ví dụ:
   * Thay vì sử dụng <<job_position.recruitment_request.job_position.job_name>>
   * Chỉ cần sử dụng <<job_name>>
   *
   * @param template Template cần xử lý
   * @param candidateData Dữ liệu ứng viên
   * @returns Chuỗi đã thay thế placeholder
   */
  processSimplifiedCandidateTemplate(template: string, candidateData: Record<string, any>): string {
    return this.processCompletelyFlattenedTemplate(template, candidateData, {
      keepPlaceholder: false,
      defaultValue: '',
    });
  }

  /**
   * Lấy danh sách các key đã dải phẳng hoàn toàn từ dữ liệu ứng viên
   * Hữu ích để hiển thị gợi ý các placeholder đơn giản có thể sử dụng
   *
   * @param candidateData Dữ liệu ứng viên
   * @returns Mảng các key đã dải phẳng hoàn toàn
   */
  getSimplifiedCandidateKeys(candidateData: Record<string, any>): string[] {
    if (!candidateData) {
      return [];
    }
    const flattenedData = this.completelyFlattenObject(candidateData);
    return Object.keys(flattenedData);
  }

  /**
   * Tạo một bản đối chiếu giữa key đơn giản và đường dẫn đầy đủ
   * Giúp người dùng hiểu mỗi key đơn giản tương ứng với đường dẫn nào trong dữ liệu gốc
   *
   * @param data Dữ liệu cần phân tích
   * @returns Ánh xạ từ key đơn giản đến đường dẫn đầy đủ
   */
  getKeyMappings(data: Record<string, any>): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    /**
     * Hàm đệ quy để duyệt qua tất cả các thuộc tính của đối tượng
     * @param current Đối tượng hiện tại
     * @param path Đường dẫn hiện tại
     */
    function traverse(current: any, path: string = '') {
      if (current === null || current === undefined) {
        return;
      }

      // Nếu là đối tượng (không phải mảng)
      if (typeof current === 'object' && !Array.isArray(current)) {
        // Duyệt qua tất cả các thuộc tính
        for (const key in current) {
          if (Object.prototype.hasOwnProperty.call(current, key)) {
            const value = current[key];
            const newPath = path ? `${path}.${key}` : key;

            // Nếu là giá trị đơn giản (không phải đối tượng), thêm vào ánh xạ
            if (value === null || value === undefined || typeof value !== 'object') {
              if (!result[key]) {
                result[key] = [];
              }
              result[key].push(newPath);
            }
            // Nếu là mảng
            else if (Array.isArray(value)) {
              if (!result[key]) {
                result[key] = [];
              }
              result[key].push(newPath);

              // Duyệt qua từng phần tử của mảng
              value.forEach((item, index) => {
                if (item !== null && typeof item === 'object') {
                  traverse(item, `${newPath}[${index}]`);
                }
              });
            }
            // Nếu là đối tượng, tiếp tục duyệt đệ quy
            else {
              traverse(value, newPath);
            }
          }
        }
      }
    }

    // Bắt đầu duyệt từ đối tượng gốc
    traverse(data);

    return result;
  }

  /**
   * Xử lý template đặc biệt cho nội dung HTML
   * Hàm này đảm bảo các placeholder trong nội dung HTML được thay thế đúng cách
   * mà không làm hỏng cấu trúc HTML
   *
   * @param htmlContent Nội dung HTML chứa placeholder
   * @param data Dữ liệu để thay thế
   * @returns Nội dung HTML đã xử lý
   */
  processHtmlContent(htmlContent: string, data: Record<string, any>): string {
    if (!htmlContent || !data) {
      return htmlContent || '';
    }

    try {
      // Dải phẳng dữ liệu
      const flattenedData = this.completelyFlattenObject(data);

      // Regex để tìm các placeholder
      const placeholderRegex = /\{\{([^}]+)\}\}/g;

      // Lưu lại các placeholder đã tìm thấy để debug
      const placeholders: string[] = [];
      let match;
      while ((match = placeholderRegex.exec(htmlContent)) !== null) {
        placeholders.push(match[1]);
      }

      // Xử lý từng placeholder riêng biệt để tránh ảnh hưởng đến cấu trúc HTML
      const processed = htmlContent.replace(placeholderRegex, (match, key) => {
        // Xử lý các key với định dạng đặc biệt, ví dụ: key|uppercase
        const [actualKey, ...formatters] = key.split('|');

        // Tìm kiếm key trong dữ liệu dải phẳng
        let value = flattenedData[actualKey];

        // Nếu không tìm thấy và actualKey có dấu chấm, thử lấy phần cuối cùng của key
        if ((value === null || value === undefined) && actualKey.includes('.')) {
          const simpleKey = actualKey.split('.').pop() || '';
          value = flattenedData[simpleKey];
        }

        // Nếu không tìm thấy giá trị
        if (value === null || value === undefined) {
          return '';
        }

        // Áp dụng các hàm định dạng nếu có
        if (formatters.length > 0) {
          value = this.applyFormatters(value, formatters);
        }

        return String(value);
      });

      return processed;
    } catch (error) {
      console.error('Error processing HTML template:', error);
      return htmlContent;
    }
  }
}
