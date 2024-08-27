import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from './goldLazyBaseQuery';

export { baseQuery };

export default createApi({
  reducerPath: 'goldApi',
  baseQuery,
  endpoints: () => ({}),
});
