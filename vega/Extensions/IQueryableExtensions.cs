using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using vega.Core.Models;
using vega.Models;

namespace vega.Extensions
{
    public static class IqueryableExtensions
    {
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, IQueryObject queryObject,  Dictionary<string, Expression<Func<T, object>>> columnsMapping)
        {
            if(String.IsNullOrWhiteSpace(queryObject.SortBy) || !columnsMapping.ContainsKey(queryObject.SortBy))
                return query;

            if(queryObject.IsSortAscending)
                query = query.OrderBy(columnsMapping[queryObject.SortBy]);
            else
                query = query.OrderByDescending(columnsMapping[queryObject.SortBy]);

            return query;
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObject)
        {
            if(queryObject.PageSize <= 0)
                queryObject.PageSize = 10;
                
            if(queryObject.Page <=0)
                queryObject.Page = 1;

            return query = query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);
        }
    }
}