using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NYBE.Data;
using NYBE.Models;
using Microsoft.AspNetCore.Identity;
using NYBE.Models.BookViewModel;
using Microsoft.EntityFrameworkCore;

namespace NYBE.Controllers
{
    public class BookController : Controller
    {
        private readonly ApplicationDbContext ctx;
        private readonly UserManager<ApplicationUser> usrCtx;
        public BookController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            ctx = dbContext;
            usrCtx = userManager;
        }

        //GET Id
        public IActionResult Index(int bookId, string sortOrder)
        {
            ViewData["PriceSortParm"] = string.IsNullOrEmpty(sortOrder) ? "price_desc" : ""; 
            ViewData["ConditionSortParm"] = sortOrder == "Condition" ? "cond_desc" : "Condition";


            var viewModel = new BookViewModel();
            var book = ctx.Books.Where(a => a.ID == bookId).FirstOrDefault();
            if (book == null)
            {
                return NotFound();
            }
            viewModel.book = book;
            //type == 0(selling)
            var forSaleListings = ctx.BookListings.Include("User").Include("User.School").Include("Book").Include("Course").Where(a => a.BookID == bookId && a.Type == 0);
            

            switch(sortOrder)
            {
                case "cond_desc":
                    viewModel.forSaleListings = orderByCondition(forSaleListings, true);
                    break;
                case "Condition":
                    viewModel.forSaleListings = orderByCondition(forSaleListings, false);
                    break;
                case "price_desc":
                    viewModel.forSaleListings = forSaleListings.OrderByDescending(b => b.AskingPrice).ToList();
                    break;
                default:
                    viewModel.forSaleListings = forSaleListings.OrderBy(b => b.AskingPrice).ToList();
                    break;
            }

            //type == 1(buying)
            var toBuyListings = ctx.BookListings.Include("User").Include("User.School").Include("Book").Include("Course").Where(a => a.BookID == bookId && a.Type == 1);
            viewModel.toBuyListings = toBuyListings.ToList();

            return View(viewModel);
        }

        public ActionResult WishList(string bookId)
        {
            //TODO: add to wishlist
            return RedirectToAction("Index", "Profile");
        }

        private List<BookListing> orderByCondition(IQueryable<BookListing> listings, bool isDescending)
        {
            List<BookListing> newListing = listings.Where(l => l.Condition == "New").ToList();
            List<BookListing> excellentListing = listings.Where(l => l.Condition == "Excellent").ToList();
            List<BookListing> goodListing = listings.Where(l => l.Condition == "Good").ToList();
            List<BookListing> fairListing = listings.Where(l => l.Condition == "Fair").ToList();
            List<BookListing> badListing = listings.Where(l => l.Condition == "Bad").ToList();

            if(isDescending) {
                newListing.AddRange(excellentListing);
                newListing.AddRange(goodListing);
                newListing.AddRange(fairListing);
                newListing.AddRange(badListing);
                return newListing;
            }

            else
            {
                badListing.AddRange(fairListing);
                badListing.AddRange(goodListing);
                badListing.AddRange(excellentListing);
                badListing.AddRange(newListing);
                return badListing;
            }
        }
    }  
}