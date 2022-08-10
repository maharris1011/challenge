{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
module Paths_haskell_sum_of_digits (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,1,0,0] []
bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/Users/markharris/.cabal/bin"
libdir     = "/Users/markharris/.cabal/lib/x86_64-osx-ghc-8.6.5/haskell-sum-of-digits-0.1.0.0-inplace-haskell-sum-of-digits-exe"
dynlibdir  = "/Users/markharris/.cabal/lib/x86_64-osx-ghc-8.6.5"
datadir    = "/Users/markharris/.cabal/share/x86_64-osx-ghc-8.6.5/haskell-sum-of-digits-0.1.0.0"
libexecdir = "/Users/markharris/.cabal/libexec/x86_64-osx-ghc-8.6.5/haskell-sum-of-digits-0.1.0.0"
sysconfdir = "/Users/markharris/.cabal/etc"

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "haskell_sum_of_digits_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "haskell_sum_of_digits_libdir") (\_ -> return libdir)
getDynLibDir = catchIO (getEnv "haskell_sum_of_digits_dynlibdir") (\_ -> return dynlibdir)
getDataDir = catchIO (getEnv "haskell_sum_of_digits_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "haskell_sum_of_digits_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "haskell_sum_of_digits_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
