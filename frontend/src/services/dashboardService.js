import { farmerService }     from './farmerService';
import { cropService }       from './cropService';
import { fieldService }      from './fieldService';
import { cropRecordService } from './cropRecordService';

export const dashboardService = {
  getSummary: async () => {
    const [farmers, crops, fields, records] = await Promise.all([
      farmerService.getAll(),
      cropService.getAll(),
      fieldService.getAll(),
      cropRecordService.getAll(),
    ]);
    return { farmers, crops, fields, records };
  },
};
