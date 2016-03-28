using System;
using System.Linq;
using System.Collections.Generic;

namespace Sabersmith{
    #region ProductClass
    ///<summary>
    /// Class to mimic the products table from the database
    ///</summary>
    //[Table(Name="products")]
    public class Product
    {
        public Guid pk_ProductID;
        public int fk_CategoryID;
        public int fk_SubCategoryID;
        public string ProductCode;
        public string ProductName;
        public string ProductDesc;
        public float OverallLength;
        public float BladeLength;
        public float SecondaryBladeLength;
        public float TertiaryBladeLength;
        public float ShippingWeight;
        public bool CanModify;
        public int QtyPerUnit;
        public float UnitPrice;
        public int TimeReq;
        public int UnitsOnOrder;
        public bool Discontinued;
        public string URLName;
        public string IMGPath;
        public int fk_CreatedBy;
        public DateTime DateCreated;
        public int fk_UpdatedBy;
        public DateTime DateUpdated;
    }
    #endregion
}